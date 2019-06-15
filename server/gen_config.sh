#!/bin/bash

function fail(){
  tput setaf 1; echo "Failure: $*" && tput sgr0
  exit 1
}

function info() {
  tput setaf 6; echo "$*" && tput sgr0
}

function success() {
  tput setaf 2; echo "$*" && tput sgr0
}

function check_aws() {
  info "checking aws cli configuration..."

  if ! [ -f ~/.aws/config ]; then
    if ! [ -f ~/.aws/credentials ]; then
      fail "AWS config not found or CLI not installed. Please run \"aws configure\"."
    fi
  fi

  success "aws cli is configured"
}

function check_jq() {
  info "checking if jq is installed..."

  if ! [ -x "$(command -v jq)" ]; then
    fail "jq is not installed."
  fi

  success "jq is installed"
}

function check_stack() {
  info "checking if $STACK_NAME exists..."

  summaries=$(aws cloudformation list-stacks | jq --arg STACK_NAME "$STACK_NAME" '.StackSummaries |
    .[] | select((.StackName ==
  $STACK_NAME) and ((.StackStatus == "CREATE_COMPLETE") or (.StackStatus == "UPDATE_COMPLETE")))')
  if [ -z "$summaries" ]
  then
    fail "The StackStatus of '$STACK_NAME' is not CREATE_COMPLETE or UPDATE_COMPLETE"
  fi

  success "$STACK_NAME exists"
}

function generate_config() {
  info "generating config file..."
  output_file=${CONFIG_PATH}
  temp_file=temp.json

  # Region
  region=$(aws configure get region)
  jq --null-input --arg AWS_REGION $region '. + { AwsRegion: $AWS_REGION }' > $output_file
  success "Found Region"

  # Get all CloudFormation Outputs
  outputs=$(aws cloudformation describe-stacks --stack-name $STACK_NAME | jq '.Stacks | .[] | .Outputs | .[]')

  # ServiceEndpoint (API Gateway)
  service_endpoint=$(echo $outputs | jq --raw-output 'select(.OutputKey == "ServiceEndpointWebsocket") | .OutputValue')
  jq --arg SERVICE_ENDPOINT ${service_endpoint} '{ AwsApiGatewayInvokeUrl: $SERVICE_ENDPOINT }' $output_file > $temp_file \
    && mv $temp_file $output_file
  success "Found Api Gateway Invoke Url"

  success "config file created"
}

STACK_NAME=kmeets-dev
CONFIG_PATH='../client/config.json'

check_aws
check_jq
check_stack
generate_config
